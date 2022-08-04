const { User } = require("../lib/sequelize");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { generateToken, verifyToken } = require("../lib/jwt");
const mailer = require("../lib/mailer");
const fs = require("fs")
const mustache = require("mustache");


async function SendVerification(id, email, username){
  const token = await generateToken({id, isEmailVerification: true}, "180s")
  const url_verify = process.env.LINK_VERIFY + token;
  const template = fs.readFileSync(__dirname + '/../templates/verify.html').toString()
    const renderTemplate = mustache.render(template, {
        username,
        verify_url: url_verify,
    })

    await mailer({
        to: email,
        subject: "hallo " + username +  " please kindly verify your account",
        html: renderTemplate
    })

  return token
}

// -------------------- Send Reset Password link to email -------------------- //
async function resetPassword(email){
  const token = generateToken({email, isEmailVerification: true}, "10000s")
  const url_reset = process.env.RESET_PASS + token;
  const template = fs.readFileSync(__dirname + '/../templates/forgot.html').toString()
    const renderTemplate = mustache.render(template, {
        email,
        forgot_password_url: url_reset,
    })
      await mailer({
        to: email,
        subject: "Reset Password",
        html: renderTemplate
      });

  return token
}

const userController = {
  // -------------------- User Login Controller -------------------- //
  login: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const user = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
        },
      });

      if (!user) {
        throw new Error("username/email not found");
      }
      const checkPass = bcrypt.compareSync(password, user.password);

      if (!checkPass) {
        throw new Error("wrong password");
        // return res.status(400).json({
        //   message: "wrong passs"
        // })
      }

      const token = generateToken({ id: user.id, password: user.password });

      delete user.dataValues.password;
      delete user.dataValues.createdAt;
      delete user.dataValues.updateAt;

      console.log(user);

      res.status(200).json({
        message: "login succeed",
        result: { user, token },
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err.toString(),
      });
    }
  },

  // -------------------- User ID Controller -------------------- //
  getUserId: async (req, res) => {
    try {
      const { id } = req.params;
      
      const findUser = await User.findAll({
        attributes: ['id','username','email','full_name','online_status','bio','phone_no','gender','web','image_url','total_post'],
          where: {
            id,
          },
        }
      )
      return res.status(200).json({
        message: "Get User Profile",
        result: findUser,  
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  },

  // -------------------- get User ONLINE Controller -------------------- //
  getUser: async (req, res) => {
    try {      
      const findUser = await User.findAll({
        attributes: ['id','username','email','full_name','online_status','image_url'],
        order: [["online_status", "DESC"]]
      }
      )
      return res.status(200).json({
        message: "Get User Profile",
        result: findUser,  
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  },

  // -------------------- User Register Controller -------------------- //
  register: async (req, res) => {
    try {
      const { username, email, password, full_name } = req.body;

      const findUser = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
        },
      });

      if (findUser) {
        throw Error("username/email has been taken");
      }

      const hashedPassword = bcrypt.hashSync(password, 5);

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        full_name,
      });

      const token = generateToken({id: user.id, isEmailVerification: true});

      const verToken = await SendVerification(user.id, email, username)
      // console.log(token);

      return res.status(200).json({
        message: "new user has been created",
        result: { user, token, verToken }
      });
    } catch (err) {
      console.log("error");
      return res.status(500).json({
        message: err.toString(),
      });
    }
  },

  // -------------------- User resend verification Controller -------------------- //
  resendVerification: async (req, res) => {
    try {
      const { id, email ,username } = req.body;

      const token = generateToken({id: id, isEmailVerification: true});

      const verToken = await SendVerification(id, email, username)

      return res.status(200).json({
        message: "Verified has been send to your email",
        result: { token, verToken }
      });
    } catch (err) {
      console.log(err.toString());
      return res.status(500).json({
        message: err.toString(),
      });
    }
  },

  // -------------------- User Reset Password Controller -------------------- //
  sendResetPass: async (req, res) => {
    try {
      const { email } = req.body;

      const token = generateToken({email: email, isEmailVerification: true});

      const resetToken = await resetPassword(email)

      return res.status(200).json({
        message: "Reset Password link has been send to your email",
        result: { token, resetToken }
      });
    } catch (err) {
      console.log("error");
      return res.status(500).json({
        message: err.toString(),
      });
    }
  },

  // -------------------- verifikasi token for Reset Password apakah masih valid atau tidak -------------------- //
  verifyResToken: async (req,res) => {
    try{
      const { restoken } = req.params
      console.log(restoken);

      const isTokenVerified = verifyToken(restoken, process.env.JWT_SECRET_KEY)

      if(!isTokenVerified || !isTokenVerified.isEmailVerification){
      throw new Error("token is invalid")
      }
      
      return res.status(200).json({
      message: "Token Reset Pass",
      success: true,
    })
    }
    catch(err) {
      console.log(err);
      res.status(400).json({
        message: err.toString(),
        success: false
      })
    }
  },

  // -------------------- Change / Reset password User -------------------- //
  changePassword: async (req,res) => {
    try{
      const { restoken } = req.params;
      const { password } = req.body;
      console.log(restoken);
      const isTokenVerified = verifyToken(restoken, process.env.JWT_SECRET_KEY)

      if(!isTokenVerified || !isTokenVerified.isEmailVerification){
      throw new Error("token is invalid")
      }
      
      const hashedPassword = bcrypt.hashSync(password, 5);

      await User.update({password: hashedPassword,},
        {where: {email: isTokenVerified.email}} );

    return res.status(200).json({
      message: "Success change password",
      success: true,
    })
    }
    catch(err) {
      console.log(err);
      res.status(400).json({
        message: err.toString(),
        success: false
      })
    }
  },
  
  // -------------------- User edit Controller -------------------- //
  editUser: async (req, res) => {
    try {
      const { id } = req.params;
      
    await User.update(
        { 
          ...req.body, 
        },
        {
          where: {
            id,
          },
        }
      )

      const user = await User.findOne({ id })

      return res.status(200).json({
        message: "User Profile Edited",
        user : user
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  },

  // -------------------- Upload Profile Picture Controller -------------------- //
  uploadProfilePict: async (req, res) => {
    try {
      const { id } = req.params;
      const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      const filePath = "profile_pict";
      const { filename } = req.file;
      
      await User.update(
        { 
          image_url: `${uploadFileDomain}/${filePath}/${filename}`,
          // ...req.body, 
        },
        {
          where: {
            id,
          },
        }
      )
      return res.status(200).json({
        message: "Success change profile picture",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  },
  
  
  // -------------------- Keep Login Controller -------------------- //
  keepLogin: async (req, res) => {
    // Terima token
    // Check kalau token valid
    // Renew token
    // Kirim token + user data
    try {
      const { token } = req;
      console.log(token);

      const renewedToken = generateToken({ id: token.id });

      const findUser = await User.findByPk(token.id);

      delete findUser.dataValues.password;

      return res.status(200).json({
        message: "Renewed user token",
        result: {
          user: findUser,
          token: renewedToken,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: err.toString(),
      });
    }
  },

  // -------------------- Verify User Controller -------------------- //
  verifyUser: async (req,res) => {
    try{
      const { vertoken } = req.params
      console.log(vertoken);
      const isTokenVerified = verifyToken(vertoken, process.env.JWT_SECRET_KEY)

      if(!isTokenVerified || !isTokenVerified.isEmailVerification){
      throw new Error("token is invalid")
      }

    await User.update({verified_status: true}, {where: {
      id: isTokenVerified.id
    }})
    return res.status(200).json({
      message: "User is Verified",
      success: true,
    })
    }
    catch(err) {
      console.log(err);
      res.status(400).json({
        message: err.toString(),
        success: false
      })
    }
  }
};

module.exports = userController;
