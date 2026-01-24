import { API } from "./types";
import { Navigator } from "@web-ui/types";
import { NewEntry } from "./NewEntry";

interface Props {
    api: API;
    navigator: Navigator;
}

function Home({ api, navigator }: Props) {
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6">
                    {/* Intro Section */}
                    <section className="mb-5">
                        <h1 className="mb-3">bin paste</h1>
                        <p>
                            This is a paste bin clone application. It allows you
                            to persist and display pieces of text through
                            multiple interfaces: CLI, API, and this web UI.
                        </p>
                    </section>

                    {/* New Entry Section */}
                    <NewEntry api={api} navigator={navigator} />
                </div>
            </div>
        </div>
    );
}

export default Home;
