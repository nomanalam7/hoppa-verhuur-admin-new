export const validateEmail = (email) => {
  if (!email) {
    return "E-mailadres is verplicht";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Voer een geldig e-mailadres in";
  }
  return "";
};

export const validatePassword = (password) => {
  if (!password) {
    return "Wachtwoord is verplicht";
  }
  if (password.length < 8) {
    return "Wachtwoord moet minimaal 8 tekens lang zijn";
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return "Wachtwoord moet minimaal één kleine letter bevatten";
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return "Wachtwoord moet minimaal één hoofdletter bevatten";
  }
  if (!/(?=.*\d)/.test(password)) {
    return "Wachtwoord moet minimaal één cijfer bevatten";
  }
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return "Wachtwoord moet minimaal één speciaal teken bevatten (@$!%*?&)";
  }
  return "";
};

export const validateConfirmPassword = (confirmPassword, password) => {
  if (!confirmPassword) {
    return "Bevestig uw wachtwoord";
  }
  if (confirmPassword !== password) {
    return "Wachtwoorden komen niet overeen";
  }
  return "";
};

export const validateOtp = (otp, length = 6) => {
  if (!otp) {
    return "OTP is verplicht";
  }
  if (otp.length !== length) {
    return `Voer een geldige ${length}-cijferige OTP-code in`;
  }
  if (!/^\d+$/.test(otp)) {
    return "OTP mag alleen cijfers bevatten";
  }
  return "";
};

export const validateLoginForm = (values) => {
  const errors = {
    email: "",
    password: "",
  };

  errors.email = validateEmail(values.email);

  if(!values.password) {
    errors.password = "Wachtwoord is verplicht";
  }

  return errors;
};

export const validateForgotPasswordForm = (values) => {
  const errors = {
    email: "",
  };

  errors.email = validateEmail(values.email);

  return errors;
};

export const validateResetPasswordForm = (values) => {
  const errors = {
    newPassword: "",
    confirmPassword: "",
  };

  errors.newPassword = validatePassword(values.newPassword);
  errors.confirmPassword = validateConfirmPassword(
    values.confirmPassword,
    values.newPassword
  );

  return errors;
};

export const validateChangePasswordForm = (values) => {
  const errors = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  if (!values.currentPassword) {
    errors.currentPassword = "Huidig wachtwoord is verplicht";
  }

  errors.newPassword = validatePassword(values.newPassword);
  errors.confirmPassword = validateConfirmPassword(
    values.confirmPassword,
    values.newPassword
  );

  return errors;
};

// Inventory Form Validations
export const validateInventoryForm = (values) => {
  const errors = {
    itemName: "",
    category: "",
    quantityAvailable: "",
    pricePerDay: "",
    description: "",
    warehouseLocation: "",
    baseService: "",
    eveningServiceFee: "",
    eveningTimeWindow: "",
    morningServiceFee: "",
    morningTimeWindow: "",
    image: "",
  };
  if (!values.itemName || values.itemName.trim() === "") {
    errors.itemName = "Itemnaam is verplicht";
  }   
  if (!values.description || values.description.trim() === "") {
    errors.description = "Beschrijving is verplicht";
  }
  if (!values.image || values.image.length === 0) {
    errors.image = "Afbeelding is verplicht";
  }
  if (!values.category || values.category === "") {
    errors.category = "Categorie is verplicht";
  }

  if (!values.quantityAvailable || values.quantityAvailable === "") {
    errors.quantityAvailable = "Beschikbare hoeveelheid is verplicht";
  } else if (isNaN(values.quantityAvailable) || parseFloat(values.quantityAvailable) < 0) {
    errors.quantityAvailable = "Voer een geldig positief getal in";
  }

  if (!values.pricePerDay || values.pricePerDay === "") {
    errors.pricePerDay = "Prijs per dag is verplicht";
  } else if (isNaN(values.pricePerDay) || parseFloat(values.pricePerDay) < 0) {
    errors.pricePerDay = "Voer een geldig positief getal in";
  }

  // Description - Optional (no validation needed)

  if (!values.warehouseLocation || values.warehouseLocation.trim() === "") {
    errors.warehouseLocation = "Magazijn locatie is verplicht";
  }

  if (values.serviceFeeEnabled) {
    if (!values.baseService || values.baseService === "") {
      errors.baseService = "Basis service is verplicht";
    } else if (isNaN(values.baseService) || parseFloat(values.baseService) < 0) {
      errors.baseService = "Voer een geldig positief getal in";
    }
  }
  
  if (values.eveningServiceEnabled) {
    if (!values.eveningServiceFee || values.eveningServiceFee === "") {
      errors.eveningServiceFee = "Avondservicekosten is verplicht";
    } else if (isNaN(values.eveningServiceFee) || parseFloat(values.eveningServiceFee) < 0) {
      errors.eveningServiceFee = "Voer een geldig positief getal in";
    }
    if (!values.eveningTimeWindow || values.eveningTimeWindow === "") {
      errors.eveningTimeWindow = "Avondtijdvenster is verplicht";
    }
  }

  if (values.morningServiceEnabled) {
    if (!values.morningServiceFee || values.morningServiceFee === "") {
      errors.morningServiceFee = "Ochtendservicekosten is verplicht";
    } else if (isNaN(values.morningServiceFee) || parseFloat(values.morningServiceFee) < 0) {
      errors.morningServiceFee = "Voer een geldig positief getal in";
    }
    if (!values.morningTimeWindow || values.morningTimeWindow === "") {
      errors.morningTimeWindow = "Ochtendtijdvenster is verplicht";
    }
  }

  return errors;
};