const User = require('../models/User')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const { googleClientId, googleClientSecret, callbackUrl } =
  require('config').get('googleAuth')

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: callbackUrl,
      passReqToCallback: true
    },
    async (request, accessToken, refreshToken, profile, done) => {
      if (!profile) {
        throw new Error('internal server Error')
      }
      const isUserExist = await User.findOne({ email: profile.emails[0].value })

      if (isUserExist && isUserExist._id) {
        return done(null, isUserExist)
      }
      const createdUser = await User.create({
        provider: {
          name: profile.provider,
          id: profile.id,
          verified: profile.emails[0].verified
        },
        name: profile.displayName,
        email: profile.emails[0].value
      })
      done(null, createdUser)
    }
  )
)

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})
