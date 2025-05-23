export const statusHandeler = (res, statusCode, success, messege) => {
  return res.status(statusCode).json({ success: success, messege: messege });
};
