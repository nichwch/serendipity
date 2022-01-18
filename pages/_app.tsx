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
  html,body{
    font-family: Inter, serif;
    color:${offBlack};
	padding:0px;
	margin:0px;
	height:100vh;
	width:100vw;
  }

/* debug */
  /* *{
	  outline:1px solid red;
  } */
`;
