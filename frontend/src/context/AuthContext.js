if (loading) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#0A0F1E',
      color: '#fff',
      fontSize: '18px',
      fontFamily: 'sans-serif',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.2)',
        borderTopColor: '#3B82F6',
        animation: 'spin 0.8s linear infinite',
      }} />
      ⟳ Loading EduTrack...
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}