import {useState, useRef} from "react";
import {ArtistBracket} from "./components/BracketArtists.jsx";
import {Bracket} from "./components/BracketTracks.jsx";
//import {ManualPicker} from "./components/ManualCell.jsx";
import {Container, Flex, Heading, Button, Input, ColorPicker, HStack, Portal, parseColor, VStack, Select, createListCollection, Grid, GridItem} from "@chakra-ui/react";
import {DownloadImage} from "./DownloadImage.js";
import './App.css'

function App() {
	const [username, setUsername] = useState("");
	const [input, setInput] = useState("");
	const [mode, setMode] = useState("default");
    const bracket = useRef(null);
	const [backgroundColor, setBackgroundColor] = useState(parseColor("#ffffff"));
	const [textColor, setTextColor] = useState(parseColor("#ffffff"));

	const handleUsernameChange = (event) => {
		setUsername(input);
	};

	const options = createListCollection({
		items: [
			{ label: "Top Artists (top tracks)", value: "default" },
			{ label: "Top Artists (name only)", value: "artists" },
			{ label: "Top Tracks", value: "tracks" },
			{ label: "One Artist", value: "artist" },
			//{ label: "Manual", value: "man" },
		],
	})

	return (
		<Container pt={5} width={'auto'}>
			<Flex pb={5} justifyContent={"center"}>
					<Heading fontSize={'5xl'} color={'crimson'}>Bracketify</Heading>
			</Flex>
			<VStack>
				{mode == "artist" ? (
					<Input placeholder="Enter artist name..." value={input} width={400} onChange={(e) => setInput(e.target.value)}/>
				) : (
					<Input placeholder="Enter valid LastFM username..." value={input} width={400} onChange={(e) => setInput(e.target.value)}/>
				)}

				{/*Color Customization*/}
				<Flex pb={5} spaceX={5} justifyContent={"center"}>
					<ColorPicker.Root defaultValue={backgroundColor} onValueChange={(e) => setBackgroundColor(e.value)} maxW="200px">
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

					<ColorPicker.Root defaultValue={textColor} onValueChange={(e) => setTextColor(e.value)} maxW="200px">
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
					<Select.Root collection={options} onChange={(e) => setMode(e.target.value)} size="sm" width="320px">
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
				</Flex>

				{/*mode == "man" ? (
					<Grid templateColumns={'repeat(8, 1fr)'} gap={3}>
						{
							new Array(8).fill(0).map((_, rowIndex) => (
								new Array(8).fill(0).map((_, colIndex) => {
									return (
										<GridItem>
											<ManualPicker/>
										</GridItem>
									)
								})
							))
						}
					</Grid>
				) : (
					null
				)*/}

				<Button variant={'ghost'} colorPalette={'red'} onClick={handleUsernameChange}>Generate!</Button>

				<Flex
					ref={bracket}
					overflowX="auto"
					scrollBehavior="smooth"
				>
					{mode == "artists" || mode == "default" ? (
						<ArtistBracket username={username} mode={mode} bgcolor={backgroundColor} textcolor={textColor}/>
					) : (
						<Bracket username={username} mode={mode} bgcolor={backgroundColor} textcolor={textColor}/>
					)}
				</Flex>
			</VStack>
			<Flex mt={5} justifyContent={'center'}>
            	<Button variant={'ghost'} colorPalette={'red'} onClick={() => {
            	    DownloadImage(bracket.current)
            	}}>Download Image</Button>
        	</Flex>
		</Container>
	)
}

export default App
