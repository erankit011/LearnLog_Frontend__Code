import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);

  if (isToday(d)) {
    return `Today, ${format(d, 'h:mm a')}`;
  }

  if (isYesterday(d)) {
    return `Yesterday, ${format(d, 'h:mm a')}`;
  }

  return format(d, 'dd/MM/yyyy • h:mm a');
};

export const formatShortDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'dd/MM/yyyy');
};

export const formatTimeAgo = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatDuration = (minutes) => {
  if (!minutes) return '0 min';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${mins}m`;
  }
};
