import React from 'react';
import { Box, Text, Image, Skeleton, useColorMode } from '@chakra-ui/react';

/**
 * MangaCard - A component to display manga details or a loading skeleton.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {boolean} props.isLoading - Indicates if the data is still loading.
 * @param {string} [props.title] - The title of the manga. Required if isLoading is false.
 * @param {string} [props.author] - The author of the manga. Required if isLoading is false.
 * @param {string} [props.imageUrl] - The URL of the manga's image. Required if isLoading is false.
 * @returns {JSX.Element} The MangaCard component.
 */
const MangaCard = ({ isLoading, title, author, imageUrl }) => {
    const { colorMode } = useColorMode();
    const bgColor = { light: "gray.100", dark: "gray.700" };

    if (isLoading) {
        return (
            <Box width="200px" height="300px" boxShadow="lg" borderRadius="md" overflow="hidden" backgroundColor={bgColor[colorMode]} p={3}>
                <Skeleton height="70%" borderRadius="md" />
                <Box mt={3}>
                    <Skeleton height="12px" mb={2} />
                    <Skeleton height="12px" width="70%" />
                </Box>
            </Box>
        );
    }

    return (
        <Box width="200px" height="300px" boxShadow="lg" borderRadius="md" overflow="hidden" backgroundColor={bgColor[colorMode]} p={3}>
            <Image src={imageUrl} alt={title} borderRadius="md" objectFit="cover" height="70%" />
            <Box mt={3}>
                <Text fontWeight="bold">{title}</Text>
                <Text>{author}</Text>
            </Box>
        </Box>
    );
};

export default MangaCard;
