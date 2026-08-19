const Notification =
  require("../models/Notification");

// ==========================================
// CREATE NOTIFICATION
// ==========================================

const createNotification = async ({
  recipient,
  title,
  message,
  type = "system"
}) => {

  try {

    console.log(
      "Creating notification..."
    );

    console.log({
      recipient,
      title,
      message,
      type
    });


    const notification =
      await Notification.create({

        recipient,

        title,

        message,

        type

      });


    console.log(
      "Notification created:",
      notification._id
    );


    return notification;


  } catch (error) {

    console.error(
      "Create notification error:",
      error
    );

    return null;

  }

};


// ==========================================
// GET ADMIN NOTIFICATIONS
// ==========================================

const getAdminNotifications =
  async (req, res) => {

    try {

      const notifications =
        await Notification.find({

          recipient:
            req.user._id

        })
        .sort({
          createdAt: -1
        })
        .limit(50);


      const unreadCount =
        await Notification.countDocuments({

          recipient:
            req.user._id,

          read: false

        });


      res.status(200).json({

        notifications,

        unreadCount

      });

    } catch (error) {

      console.error(
        "Get notifications error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to load notifications",

        error:
          error.message

      });

    }

  };


// ==========================================
// MARK ONE AS READ
// ==========================================

const markNotificationAsRead =
  async (req, res) => {

    try {

      const notification =
        await Notification.findOneAndUpdate(

          {
            _id:
              req.params.id,

            recipient:
              req.user._id
          },

          {
            read: true
          },

          {
            new: true
          }

        );


      if (!notification) {

        return res.status(404).json({

          message:
            "Notification not found"

        });

      }


      res.status(200).json({

        message:
          "Notification marked as read",

        notification

      });

    } catch (error) {

      console.error(
        "Mark notification error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to update notification",

        error:
          error.message

      });

    }

  };


// ==========================================
// MARK ALL AS READ
// ==========================================

const markAllNotificationsAsRead =
  async (req, res) => {

    try {

      await Notification.updateMany(

        {
          recipient:
            req.user._id,

          read: false

        },

        {
          read: true
        }

      );


      res.status(200).json({

        message:
          "All notifications marked as read"

      });

    } catch (error) {

      console.error(
        "Mark all notifications error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to update notifications",

        error:
          error.message

      });

    }

  };


module.exports = {

  createNotification,

  getAdminNotifications,

  markNotificationAsRead,

  markAllNotificationsAsRead

};