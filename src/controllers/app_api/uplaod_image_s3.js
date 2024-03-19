const {uplaodImageS3} = require("../../services/app_api");
const {RENDER_BAD_REQUEST} = require("../../utils/utils");

const uplaod_image_s3 = async (req, res) => {
  try {
    const {error, error_message, data} = await uplaodImageS3(req.files);

    if (error) {
      return res.status(400).json({
        code: 400,
        message: error_message,
      });
    }

    res.status(200).json({
      code: 200,
      message: "Image uploaded Sucessfully",
      path: data.path,
    });
  } catch (e) {
    RENDER_BAD_REQUEST(res, e);
  }
};

module.exports = uplaod_image_s3;
