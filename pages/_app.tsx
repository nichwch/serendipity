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

	button{
		all:unset;
	}
  html,body{
    font-family: Inter, serif;
    color:${offBlack};
	padding:0px;
	margin:0px;
	height:100vh;
	width:100vw;
	background-color: #f7f7f7;

	overflow-x: hidden;
  }

/* debug */
  /* *{
	  outline:1px solid red;
  } */
`;
