import "../Views/DestinationConfirmViews.css";
import PlatformSelector from "../Components/PlatformSelector";


const DestinationConfirm = () => {

    return (
        <main>
            <h1>Where are we transferring this playlist to?</h1>
            <PlatformSelector />
        </main>
    );
}

export default DestinationConfirm;