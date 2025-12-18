const validateUser = (req, res, next) => {
  const { firstName, lastName, email, age, gender, middleInitial } = req.body;

  if (!firstName || !lastName || !email || !age || !gender)
    return res
      .status(400)
      .json({ success: false, message: "Some Fields are Missing" });

  const nameRegex = /^[A-Za-z ]+$/; // allows letters and spaces
  const initialRegex = /^[A-Za-z]+$/;

  if (
    !nameRegex.test(firstName) ||
    !nameRegex.test(lastName) ||
    (middleInitial && !initialRegex.test(middleInitial))
  )
    return res
      .status(400)
      .json({
        success: false,
        message: "Names must contain only letters and spaces",
      });

  const emailRegex = /^[\w.-]+@smu\.edu\.ph$/;
  if (!emailRegex.test(email))
    return res
      .status(400)
      .json({ success: false, message: "Only smu.edu.ph Emails Onlys" });

  if (age < 1 || age > 500)
    return res
      .status(400)
      .json({ success: false, message: "Age Must Be Between 1 and 500" });

  const allowedGenders = ["male", "female", "rather not say"];
  if (!allowedGenders.includes(gender))
    return res
      .status(400)
      .json({ success: false, message: "Gender is Invalid" });

  next();
};

module.exports = {
  validateUser,
};
