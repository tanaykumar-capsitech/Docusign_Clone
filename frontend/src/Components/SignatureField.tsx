import { useState } from "react"

interface SignatureFieldPositions {
    onPlace: (x: number, y: number) => void
}

const SignatureField = ({ onPlace }: SignatureFieldPositions) => {
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null)

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()

        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        setPosition({ x, y })
        onPlace(x, y)
    }

    return (
        <div onClick={handleClick} className="absolute inset-0 cursor-crosshair">
            {position &&
                (
                    <div
                        style={{
                            position: 'absolute',
                            left: position.x,
                            top: position.y,
                            width: 70,
                            height: 70,
                            border: '1px solid #9e9e9e',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'none'
                        }}
                    >
                        Sign Here
                    </div>
                )
            }
        </div>
    )
}

export default SignatureField