const root = ReactDOM.createRoot( document.getElementById("root"));
const ChildComponent = (props) => {
    // console.log(props);
    const { name, email, section,isStudent } = props;
    return (<div>
        <h1>Hello {name}</h1>
        <h1>{email}</h1>
        <h2>{section}</h2>
        {isStudent?<p>Student</p>:<p>Not Student</p>}
        {/* {user.map((u) =>
            <div>
                <h1>Hello {u.name}</h1>
                <h1>{u.email}</h1>
                <h2>{u.section}</h2>
            </div>
        )} */}

    </div>)
}
const ParentComponent = () => {
    let user = [{
        name: "Rohini",
        email: "rohini@gmail.com",
        section: "cse-16"
    },
    {
        name: "xyz",
        email: "xyz@gmail.com",
        section: "cse-16"
    }]
    return (<div>
        <ChildComponent {...user[0]} isStudent={false} />
        <ChildComponent {...user[1]} section="cse-17" isStudent={true}/>
        {/* <ChildComponent name={name} email={email} section={section} /> */}
    </div>)
}
root.render(<ParentComponent />)