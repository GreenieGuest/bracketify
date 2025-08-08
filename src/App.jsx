import {useState, useRef} from "react";
import {Bracket} from "./components/Bracket.jsx";
import {Container, Flex, Heading, Button, Input, ColorPicker, HStack, Portal, parseColor, VStack} from "@chakra-ui/react";
import {DownloadImage} from "./DownloadImage.js";
import './App.css'

function App() {
	const [username, setUsername] = useState("");
	const [input, setInput] = useState("");
    const bracket = useRef(null);

	const handleUsernameChange = (event) => {
		setUsername(input);
	};
	
	const [backgroundColor, setBackgroundColor] = useState(parseColor("#ffffff"));
	const [textColor, setTextColor] = useState(parseColor("#ffffff"));

	return (
		<Container pt={5} width={'auto'}>
			<Flex pb={5} justifyContent={"center"}>
					<Heading fontSize={'5xl'} color={'crimson'}>Bracketify</Heading>
			</Flex>
			<VStack>
				<Input placeholder="Enter valid LastFM username..." value={input} width={400} onChange={(e) => setInput(e.target.value)}/>

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
				
				<Button variant={'ghost'} colorPalette={'red'} onClick={handleUsernameChange}>Generate!</Button>

				<Flex
					ref={bracket}
					overflowX="auto"
					scrollBehavior="smooth"
				>
					<Bracket username={username} bgcolor={backgroundColor} textcolor={textColor}/>
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
