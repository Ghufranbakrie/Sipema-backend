export function formatPhoneNumber(phoneNumber: string) {
    if (phoneNumber.startsWith('62')) {
        return phoneNumber;
    }
    if (phoneNumber.startsWith('0')) {
        return `62${phoneNumber.substring(1)}`;
    }
    return `62${phoneNumber}`;
}

export const getStatusMessage = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'sedang menunggu persetujuan';
      case 'process':
        return 'saat ini sedang dalam PROCESS.';
      case 'rejected':
        return 'telah REJECTED.';
      case 'completed':
        return 'telah COMPLETED.';
      default:
        return `sedang dalam status ${status}`;
    }
};
