import React from 'react';

const PrinterConnection = ({ status }) => {
  // Map statuses to their corresponding icons and tooltips
  const statusConfig = {
    serviceDisconnected: {
      icon: 'pi pi-ban', // Replace with appropriate icon
      tooltip: 'Service is disconnected',
      color: 'text-red-500', // Tailwind class for red
    },
    printdeskNotAvailable: {
      icon: 'pi pi-info-circle', // Replace with appropriate icon
      tooltip: 'Print desk is not available',
      color: 'text-orange-400', // Tailwind class for orange-yellow
    },
    printdeskConnected: {
      icon: 'pi pi-print',
      tooltip: 'Print desk is available',
      color: 'text-green-500', // Tailwind class for green
    },
    default: {
      icon: 'pi pi-question', // Default icon
      tooltip: 'Unknown status',
      color: 'text-white', // Default gray
    },
  };

  // Get the current status config or fall back to the default
  const { icon, tooltip, color } = statusConfig[status] || statusConfig.default;

  return (
    <div className="tooltip tooltip-bottom" data-tip={tooltip}>
      <i
        className={`${icon} ${color}`}
        style={{ fontSize: '1.5rem', cursor: 'pointer' }}
      ></i>
    </div>
  );
};

export default PrinterConnection;
