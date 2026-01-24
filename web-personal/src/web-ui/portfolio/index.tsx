function Portfolio() {
    return (
        <div className="container">
            <div className="my-3">
                <h1>portfolio</h1>
                <div className="row">
                    <div className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">bin-paste</h5>
                                <p className="card-text">
                                    A{" "}
                                    <a
                                        href="https://bin-paste.ffig.ar"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        paste bin clone
                                    </a>{" "}
                                    which allows to store and share pieces of
                                    text.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Portfolio;
