function userDto(user) {
  return { id: user.id,
            fullName: user.fullName, 
            email: user.email, 
            role: user.role };
    }

module.exports = { userDto };