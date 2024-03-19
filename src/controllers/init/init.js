const {initStat} = require("../../services/init");
const {RENDER_BAD_REQUEST} = require("../../utils/utils");

const init = async (req, res) => {
  try {
    const {error, error_message, data} = await initStat();

    if (error) {
      return res.status(400).json({
        code: 400,
        message: error_message,
      });
    }

    res.status(200).json({
      code: 200,
      message: "Dashboard stat successfully",
      data: data,
    });
  } catch (e) {
    RENDER_BAD_REQUEST(res, e);
  }
};

module.exports = init;
