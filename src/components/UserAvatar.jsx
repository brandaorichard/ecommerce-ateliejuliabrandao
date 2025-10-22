export default function UserAvatar({ user, size = 40 }) {
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (user?.profilePicture) {
    return (
      <img
        src={user.profilePicture}
        alt={user.nome}
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid #7a4fcf'
        }}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#7a4fcf',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size / 2.5,
        fontWeight: 'bold',
        border: '2px solid #7a4fcf'
      }}
    >
      {getInitials(user?.nome)}
    </div>
  );
}
