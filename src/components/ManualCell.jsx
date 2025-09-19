import {Box, Button, HStack, Input, Popover, Portal, Text, VStack} from "@chakra-ui/react";
import {useState, useMemo} from "react";
import axios from "axios";
import {debounce} from "throttle-debounce";


const ManualPicker = ({title, onTrackSelect}) => {
	const [selectedTrack, setSelectedTrack] = useState("");
	const [selectedArtist, setSelectedArtist] = useState("");
	const [selectedListens, setSelectedListens] = useState("");

    const [searchResults, setSearchResults] = useState([]);
    const [topTracks, setTopTracks] = useState([]);

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

    const returnTopTracks = useMemo(
		() =>
			debounce(500, (e) => {
				axios.get(`
					https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${e.split(' ').join('+')}&api_key=38453222bd8526be0f30d941903e739f&format=json&limit=64`)
				.then(
					response => setTopTracks(response.data.toptracks.track)
				)
			}),
		[]	
	)

    const handleTrackClick = async (track) => {
        const trackData = {
            title,
            name: track.name,
            artist: track.artist.name,
            listeners: track.listeners,
        };

        onTrackSelect(trackData);
        setOpen(false);
    };

    return (
        <VStack>
            <Popover.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
                <Popover.Trigger>
                    <VStack gap={1} alignItems="flex-start">
                        {
                            selectedTrack !== "" ?
                                <VStack gap={0} alignItems="flex-start">
                                    <Text fontWeight="medium" fontSize="md" isTruncated>
                                    {selectedTrack}
                                    </Text>
                                    <Text fontSize="xs" color="gray.400">
                                    {selectedArtist} - {selectedListens} listeners 
                                    </Text>
                                </VStack>
                                :
                                <Text>{title}</Text>
                        }
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
                                        setOpen(false);
                                    }} size={'sm'} h={'38px'} variant={'surface'}>Clear</Button>
                                </HStack>
                                {
                                    searchResults.slice(0,5).map((artist) => (
                                        <Box mt={1} className={'popover-card-item'} onClick={() => {
                                            setTopTracks([]);
                                            returnTopTracks(artist.name);
                                        }}>
                                            <Text maxW={215} whiteSpace={'nowrap'} overflow={'hidden'} textOverflow={'ellipsis'}>{artist.name}</Text>
                                        </Box>
                                    ))
                                }
                                {topTracks.length > 0 && (
                                <Box
                                    mt={3}
                                    maxHeight="300px"
                                    overflowY="auto"
                                    borderTop="1px solid #444"
                                    pt={2}
                                >
                                    {topTracks.map((track, index) => (
                                    <Box
                                        key={index}
                                        className="popover-track-item"
                                        p={1}
                                        mb={1}
                                        borderRadius="md"
                                        _hover={{ backgroundColor: "#333", cursor: "pointer" }}
                                        onClick={async () => {
                                            handleTrackClick(track)
                                            setOpen(false);
                                            console.log("Selected track:", {
                                                name: track.name,
                                                listeners: track.listeners,
                                            });
                                            
                                            // For display
                                            setSelectedTrack(track.name)
                                            setSelectedArtist(track.artist.name)
                                            setSelectedListens(track.listeners)
                                        }}
                                    >
                                        <HStack>
                                            <Text fontWeight="medium" fontSize="lg" isTruncated>
                                            {index + 1}. 
                                            </Text>
                                            <VStack gap={0} alignItems={'left'}>
                                                <Text fontWeight="medium" fontSize="sm" isTruncated>
                                                {track.name}
                                                </Text>
                                                <Text fontSize="xs" color="gray.400">
                                                {track.listeners} listens
                                                </Text>
                                            </VStack>
                                        </HStack>
                                    </Box>
                                    ))}
                                </Box>
                                )}

                            </Popover.Body>
                        </Popover.Content>
                    </Popover.Positioner>
                </Portal>
            </Popover.Root>
        </VStack>
    )
}

export { ManualPicker }