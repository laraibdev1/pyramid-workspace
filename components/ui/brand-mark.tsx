export function BrandMark({ size = 20 }: { size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        background: '#161616',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '0 0 auto',
      }}
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
        <path d="M12 2C16 8 20 14 20 17C20 20.3 16.4 22 12 22C7.6 22 4 20.3 4 17C4 14 8 8 12 2Z" fill="white" />
      </svg>
    </span>
  )
}
