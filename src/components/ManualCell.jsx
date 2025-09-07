import {Box, Button, HStack, Image, Input, Popover, Portal, Text, VStack} from "@chakra-ui/react";
import {useState, useMemo} from "react";
import axios from "axios";
import {debounce} from "throttle-debounce";


const ManualPicker = ({title}) => {
    const [imageURL, setImageURL] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    //Used for popover
    const [open, setOpen] = useState(false);

    const returnSearch = useMemo(
        () =>
            debounce(500, (e) => {
                axios.get(`https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${e}&api_key=38453222bd8526be0f30d941903e739f&format=json`)
                    .then(response => setSearchResults(response.data.results.artistmatches.artist))
            }),
        []
    )

    return (
        <VStack>
            <Popover.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
                <Popover.Trigger>
                    <VStack gap={1}>
                        {
                            imageURL !== "" ?
                                <Image className={'track-img'} width={50} height={50} src={imageURL} alt="" />
                                :
                                <Box className={'placeholder-img'} width={50} height={50} backgroundColor={'#222222'}/>
                        }
                        <Text>{title}</Text>
                    </VStack>
                </Popover.Trigger>
                <Portal>
                    <Popover.Positioner>
                        <Popover.Content>
                            <Popover.Arrow />
                            <Popover.Body>
                                <Popover.Title fontWeight="medium" mb={1}>{title}</Popover.Title>
                                <HStack alignItems={'baseline'} mb={2} gap={1}>
                                    <Input placeholder={'Search artist names...'} onChange={(e) => returnSearch(e.target.value)}/>
                                    <Button onClick={() => {
                                        setImageURL("")
                                        setOpen(false);
                                    }} size={'sm'} h={'38px'} variant={'surface'}>Clear</Button>
                                </HStack>
                                {
                                    searchResults.slice(0,5).map((artist) => (
                                        <Box mt={1} className={'popover-card-item'} onClick={() => {
                                            setImageURL(artist.image[3]['#text'])
                                            setOpen(false)
                                        }}>
                                            <HStack>
                                                <Image borderRadius={3} w={50} src={artist.image[2]['#text']}/>
                                                <VStack gap={0} alignItems={'left'}>
                                                    <Text maxW={215} whiteSpace={'nowrap'} overflow={'hidden'} textOverflow={'ellipsis'}>{artist.name}</Text>
                                                    <Text maxW={215} whiteSpace={'nowrap'} overflow={'hidden'} textOverflow={'ellipsis'} color={'dimgray'}>{artist.artist}</Text>
                                                </VStack>
                                            </HStack>
                                        </Box>
                                    ))
                                }
                            </Popover.Body>
                        </Popover.Content>
                    </Popover.Positioner>
                </Portal>
            </Popover.Root>
        </VStack>
    )
}

export { ManualPicker }