import styled from "@emotion/styled";
import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

// LoL-inspired Color Palette
const colors = {
	gold: "#C8AA6E",
	goldHover: "#F0E6D2",
	blue: "#0AC8B9",
	darkBlue: "#091428",
	hextechMagice: "#CDFAFA",
	text: "#F0E6D2",
};

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: ${colors.darkBlue};
  background-image: radial-gradient(circle at center, #1a2c4e 0%, #091428 100%);
  color: ${colors.text};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Beaufort", "Spiegel", "Roboto", sans-serif;
  overflow: hidden;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('https://universe.leagueoflegends.com/images/targon_header.jpg') center/cover no-repeat;
    opacity: 0.3;
    z-index: 0;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 90%);
  }
`;

const Content = styled(Container)`
  position: relative;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const Title = styled(Typography)`
  font-weight: 800;
  color: ${colors.gold};
  text-transform: uppercase;
  text-shadow: 0 0 10px rgba(200, 170, 110, 0.5);
  letter-spacing: 0.1em;
  font-family: serif; // Fallback for specialized fonts
`;

const Subtitle = styled(Typography)`
  color: ${colors.hextechMagice};
  max-width: 600px;
  font-weight: 500;
  text-shadow: 0 0 5px rgba(10, 200, 185, 0.5);
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(180deg, ${colors.gold} 0%, #9e824c 100%);
  color: ${colors.darkBlue};
  border: 1px solid ${colors.gold};
  padding: 1rem 3rem;
  font-size: 1.25rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);

  &:hover {
    background: linear-gradient(180deg, ${colors.goldHover} 0%, ${colors.gold} 100%);
    box-shadow: 0 0 20px rgba(200, 170, 110, 0.6);
    transform: translateY(-2px);
  }

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(45deg);
    transition: transform 0.5s;
  }
`;

const Divider = styled.div`
  height: 2px;
  width: 100px;
  background: linear-gradient(90deg, transparent, ${colors.gold}, transparent);
  margin: 1rem 0;
`;

export const LandingPage = () => {
	const navigate = useNavigate();

	return (
		<PageWrapper>
			<Content maxWidth="md">
				<Box sx={{ mb: 4 }}>{/* Placeholder for Logo if needed */}</Box>

				<Title variant="h1" sx={{ fontSize: { xs: "3rem", md: "5rem" } }}>
					Voice Party
				</Title>

				<Divider />

				<Subtitle variant="h5" sx={{ mb: 4 }}>
					Gather your allies. Coordinate your strikes. Dominate the rift with
					crystal clear voice communication.
				</Subtitle>

				<PrimaryButton onClick={() => navigate("/join")} variant="contained">
					参加 (Join)
				</PrimaryButton>

				<Box sx={{ mt: 8 }}>
					<Typography variant="body2" sx={{ color: "rgba(255,255,255,0.3)" }}>
						© {new Date().getFullYear()} Voice Party. Not affiliated with Riot
						Games.
					</Typography>
				</Box>
			</Content>
		</PageWrapper>
	);
};
