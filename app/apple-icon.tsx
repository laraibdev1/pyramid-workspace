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
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '52px solid transparent',
            borderRight: '52px solid transparent',
            borderBottom: '84px solid white',
          }}
        />
      </div>
    ),
    { ...size },
  )
}
