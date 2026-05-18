export const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) {
    return null;
  }

  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath;
  }

  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 
                  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                    ? 'http://localhost:8585'
                    : window.location.origin);

  return `${baseUrl}${avatarPath}`;
};

export default getAvatarUrl;
