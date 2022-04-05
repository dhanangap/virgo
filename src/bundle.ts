import Carousel from "./components/Carousel/Carousel";
import Form from "./components/Form/Form";
import Navbar from "./components/Navigation/Navbar/Navbar";
import Scrollspy from "./components/Navigation/Scrollspy/Scrollspy";
import Tab from "./components/Tab/Tab";

// In browser environment, initialize all available components by default
if (window) {
	Scrollspy.init();
	Form.FormComponent.init();
	Tab.init();
	Carousel.init();
	Navbar.init();
}