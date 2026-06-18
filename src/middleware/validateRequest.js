function validateRequest(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors)[0]?.[0] || 'Invalid request';
      return res.status(400).json({ error: firstError, fieldErrors });
    }

    req.validatedBody = result.data;
    next();
  };
}

module.exports = validateRequest;