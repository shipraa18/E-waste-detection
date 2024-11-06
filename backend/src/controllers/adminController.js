

export const getNotifications = (req, res) => {
          const notifications = [
            { id: 1, message: 'E-Waste detected at Location A', timestamp: '2024-10-19T14:48:00.000Z' },
            { id: 2, message: 'E-Waste detected at Location B', timestamp: '2024-10-19T15:00:00.000Z' },
          ];
        
          res.status(200).json(notifications);
        };