import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 40,
          background: '#161616',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="92" height="92" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C16 8 20 14 20 17C20 20.3 16.4 22 12 22C7.6 22 4 20.3 4 17C4 14 8 8 12 2Z"
            fill="white"
          />
        </svg>
      </div>
    ),
    { ...size },
  )
}
