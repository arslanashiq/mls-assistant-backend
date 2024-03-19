const {uplaodAudio} = require("../../services/app_api");
const {RENDER_BAD_REQUEST} = require("../../utils/utils");

const uplaod_audio = async (req, res) => {
  try {
    const {error, error_message, data} = await uplaodAudio(req.files);

    if (error) {
      return res.status(400).json({
        code: 400,
        message: error_message,
      });
    }

    res.status(200).json({
      code: 200,
      message: "Audio Uploaded Successfully",
      path: data.path,
    });
  } catch (e) {
    RENDER_BAD_REQUEST(res, e);
  }
};

module.exports = uplaod_audio;
