import { createGlobalStyle } from "styled-components";
import { lightOffBlack, offBlack } from "../config/theme";

function MyApp({ Component, pageProps }) {
	return (
		<>
			<GlobalStyle />
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
const GlobalStyle = createGlobalStyle`
  html{
    font-family: Inter, serif;
    color:${offBlack}
  }
`;
