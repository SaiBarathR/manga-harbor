import { Box, Grid } from "@chakra-ui/react";
import Header from "./Header";
import MangaCard from "./commonComponents/MangaCard";
import React from "react";

const Home = () => {
    // Let's assume you have a list of mangas
    const mangas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // This is just for demonstration purposes

    return (
        <Box className="max-w-[2560px] w-full">
            <Header />
            <Grid
                templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }}
                gap={6}
                p={5}
            >
                {mangas.map(manga => (
                    <MangaCard key={manga} isLoading={true} />
                    //Example of manga
                    /*<MangaCard isLoading={false} title="Naruto" author="Masashi Kishimoto" imageUrl="https://m.media-amazon.com/images/I/71gwzyXnaNL._AC_UF1000,1000_QL80_.jpg" />*/
                ))}
            </Grid>
        </Box>
    );
}

export default Home;
