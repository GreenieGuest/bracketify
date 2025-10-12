import {useState, useRef} from "react";
import {ArtistBracket} from "./components/BracketArtists.jsx";
import {Bracket} from "./components/BracketTracks.jsx";
import {ManualBracket} from "./components/BracketManual.jsx";
import {ManualPicker} from "./components/ManualCell.jsx";
import {Container, Flex, Heading, Button, Input, ColorPicker, HStack, Portal, parseColor, VStack, Select, createListCollection, Text} from "@chakra-ui/react";
import {DownloadImage} from "./DownloadImage.js";
import './App.css'

function App() {
	const [username, setUsername] = useState("");
	const [input, setInput] = useState("");
    const bracket = useRef(null);

	const [mode, setMode] = useState("default");
	const [timeframe, setTimeframe] = useState("overall");
	const [seeding, setSeeding] = useState("default");

	const [bracketColor, setBracketColor] = useState(parseColor("#ffffff"));
	const [backgroundColor, setBackgroundColor] = useState(parseColor("#000000"));
	const [textColor, setTextColor] = useState(parseColor("#ffffff"));

	const [selectedTracks, setSelectedTracks] = useState(Array(64).fill(
		{
			"title": null,
			"name": "Null",
			"artist": "Null",
			"listeners": "0"
		}
	));

	const handleUsernameChange = (event) => {
		setUsername(input);
	};

	const options = createListCollection({
		items: [
			{ label: "Top Artists (top tracks)", value: "default" },
			{ label: "Top Artists (name only)", value: "artists" },
			{ label: "Top Tracks", value: "tracks" },
			{ label: "One Artist", value: "artist" },
			{ label: "Manual", value: "man" },
		],
	})

	const timeframes = createListCollection({
		items: [
			{ label: "Lifetime", value: "overall" },
			{ label: "Last 7 Days", value: "7day" },
			{ label: "Last 30 Days", value: "1month" },
			{ label: "Last 3 Months", value: "3month" },
			{ label: "Last 6 Months", value: "6month" },
			{ label: "Last 12 Months", value: "12month" },
		],
	})

	const seedings = createListCollection({
		items: [
			{ label: "Popularity", value: "default" },
			{ label: "Artist", value: "artist" },
			{ label: "Random", value: "random" },
			{ label: "In-Order", value: "inorder" },
			{ label: "Manual", value: "manual" },
		],
	})

	return (
		<Container pt={5} width={'auto'}>
			<Flex pb={5} justifyContent={"center"}>
					<Heading fontSize={'5xl'} color={'crimson'}>MusicBracket.fm</Heading>
			</Flex>
			<VStack>
				<Text>Pit your most listened to artists against each other, or create a custom showdown by making a manual bracket!</Text>
				{mode == "artist" ? (
					<Input placeholder="Enter artist name..." value={input} width={400} onChange={(e) => setInput(e.target.value)}/>
				) : (
					<Input placeholder="Enter valid LastFM username..." value={input} width={400} onChange={(e) => setInput(e.target.value)}/>
				)}

				{/*Color Customization*/}
				<Flex pb={5} spaceX={5} justifyContent={"center"}>
					
					<ColorPicker.Root defaultValue={backgroundColor} onValueChange={(e) => setBackgroundColor(e.value)} maxW="130px">
						<ColorPicker.HiddenInput />
						<ColorPicker.Label>Background Color</ColorPicker.Label>
						<ColorPicker.Control>
							<ColorPicker.Input />
							<ColorPicker.Trigger />
						</ColorPicker.Control>
						<Portal>
							<ColorPicker.Positioner>
							<ColorPicker.Content>
								<ColorPicker.Area />
								<HStack>
								<ColorPicker.EyeDropper size="xs" variant="outline" />
								<ColorPicker.Sliders />
								</HStack>
							</ColorPicker.Content>
							</ColorPicker.Positioner>
						</Portal>
					</ColorPicker.Root>

					<ColorPicker.Root defaultValue={bracketColor} onValueChange={(e) => setBracketColor(e.value)} maxW="130px">
						<ColorPicker.HiddenInput />
						<ColorPicker.Label>Bracket Color</ColorPicker.Label>
						<ColorPicker.Control>
							<ColorPicker.Input />
							<ColorPicker.Trigger />
						</ColorPicker.Control>
						<Portal>
							<ColorPicker.Positioner>
							<ColorPicker.Content>
								<ColorPicker.Area />
								<HStack>
								<ColorPicker.EyeDropper size="xs" variant="outline" />
								<ColorPicker.Sliders />
								</HStack>
							</ColorPicker.Content>
							</ColorPicker.Positioner>
						</Portal>
					</ColorPicker.Root>

					<ColorPicker.Root defaultValue={textColor} onValueChange={(e) => setTextColor(e.value)} maxW="130px">
						<ColorPicker.HiddenInput />
						<ColorPicker.Label>Text Color</ColorPicker.Label>
						<ColorPicker.Control>
							<ColorPicker.Input />
							<ColorPicker.Trigger />
						</ColorPicker.Control>
						<Portal>
							<ColorPicker.Positioner>
							<ColorPicker.Content>
								<ColorPicker.Area />
								<HStack>
								<ColorPicker.EyeDropper size="xs" variant="outline" />
								<ColorPicker.Sliders />
								</HStack>
							</ColorPicker.Content>
							</ColorPicker.Positioner>
						</Portal>
					</ColorPicker.Root>
				</Flex>
				
				{/*Artist Customization*/}
				<Flex pb={5} spaceX={4} justifyContent={"center"}>
					<Select.Root collection={options} onChange={(e) => setMode(e.target.value)} size="sm" width="250px">
						<Select.HiddenSelect />
						<Select.Label>Content</Select.Label>
						<Select.Control>
							<Select.Trigger>
							<Select.ValueText placeholder="Top Artists (top tracks)" />
							</Select.Trigger>
							<Select.IndicatorGroup>
							<Select.Indicator />
							</Select.IndicatorGroup>
						</Select.Control>
						<Portal>
							<Select.Positioner>
							<Select.Content>
								{options.items.map((option) => (
								<Select.Item item={option} key={option.value}>
									{option.label}
									<Select.ItemIndicator />
								</Select.Item>
								))}
							</Select.Content>
							</Select.Positioner>
						</Portal>
					</Select.Root>

					{/*Timeframes only available for certain Last.fm API fetches*/}
					{mode == "default" || mode == "artists" || mode == "tracks" ? (
						<Select.Root collection={timeframes} onChange={(e) => setTimeframe(e.target.value)} size="sm" width="150px">
							<Select.HiddenSelect />
							<Select.Label>Timeframe</Select.Label>
							<Select.Control>
								<Select.Trigger>
								<Select.ValueText placeholder="Lifetime" />
								</Select.Trigger>
								<Select.IndicatorGroup>
								<Select.Indicator />
								</Select.IndicatorGroup>
							</Select.Control>
							<Portal>
								<Select.Positioner>
								<Select.Content>
									{timeframes.items.map((option) => (
									<Select.Item item={option} key={option.value}>
										{option.label}
										<Select.ItemIndicator />
									</Select.Item>
									))}
								</Select.Content>
								</Select.Positioner>
							</Portal>
						</Select.Root>
					) : (
						null
					)}

					{/*Seeding only available for manual*/}
					{mode == "man" ? (
						<Select.Root collection={seedings} onChange={(e) => setSeeding(e.target.value)} size="sm" width="150px">
							<Select.HiddenSelect />
							<Select.Label>Seeding</Select.Label>
							<Select.Control>
								<Select.Trigger>
								<Select.ValueText placeholder="Popularity" />
								</Select.Trigger>
								<Select.IndicatorGroup>
								<Select.Indicator />
								</Select.IndicatorGroup>
							</Select.Control>
							<Portal>
								<Select.Positioner>
								<Select.Content>
									{seedings.items.map((option) => (
									<Select.Item item={option} key={option.value}>
										{option.label}
										<Select.ItemIndicator />
									</Select.Item>
									))}
								</Select.Content>
								</Select.Positioner>
							</Portal>
						</Select.Root>
					) : (
						null
					)}
				</Flex>

				{mode == "man" ? (
					<VStack>
					<Text>Enter songs below by searching for an artist and picking a track. They'll be seeded automatically.</Text>
						<VStack 
							maxHeight="600px"
							width="400px"
							overflowY="auto"
						>
							{Array.from({ length: 64 }).map((_, index) => (
								<ManualPicker
									key={index}
									title={`Track ${index + 1}`}
									onTrackSelect={(trackData) => {
										setSelectedTracks(prev => {
										const updated = [...prev];
										updated[index] = trackData;
										console.log(selectedTracks)
										return updated;
										});
									}}
								/>
							))}
						</VStack>
					</VStack>
				) : (
					null
				)}

				<Button variant={'outline'} colorPalette={'red'} onClick={handleUsernameChange}>Generate!</Button>

				<Flex
					ref={bracket}
					overflowX="auto"
					scrollBehavior="smooth"
				>
					{mode === "artists" || mode === "default" ? (
						<ArtistBracket
							username={username}
							timeframe={timeframe}
							mode={mode}
							bgcolor={backgroundColor}
							bracketcolor={bracketColor}
							textcolor={textColor}
						/>
						) : mode === "man" ? (
						<ManualBracket
							tracks={selectedTracks}
							seeding={seeding}
							bgcolor={backgroundColor}
							bracketcolor={bracketColor}
							textcolor={textColor}
						/>
						) : (
						<Bracket
							username={username}
							timeframe={timeframe}
							mode={mode}
							bgcolor={backgroundColor}
							bracketcolor={bracketColor}
							textcolor={textColor}
						/>
					)}
				</Flex>
			</VStack>
			<Flex mt={5} justifyContent={'center'}>
            	<Button variant={'outline'} colorPalette={'red'} onClick={() => {
            	    DownloadImage(bracket.current)
            	}}>Download Image</Button>
        	</Flex>
		</Container>
	)
}

export default App
