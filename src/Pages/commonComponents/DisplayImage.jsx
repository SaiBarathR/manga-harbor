import { Box, Image, Skeleton, SkeletonCircle } from "@chakra-ui/react";
import { useState } from "react";

export function DisplayImage({ type, imgSrc, alt, boxSize = '50px', skeletonWidth = '50px', skeletonHeight = '50px', boxProps, imgProps }) {
    const [loading, setLoading] = useState(true)

    return <Box className="flex" {...boxProps}>
        {loading && (type === 'circle' ? <SkeletonCircle height={skeletonHeight} width={skeletonWidth} /> : <Skeleton height={skeletonHeight} width={skeletonWidth} />)}
        <Image
            boxSize={boxSize}
            aspectRatio={'square'}
            objectFit='contain'
            src={imgSrc}
            alt={alt || 'rand'}
            onLoad={() => setLoading(false)}
            display={loading && 'none'}
            {...imgProps}
        />
    </Box>
}
export default DisplayImage;