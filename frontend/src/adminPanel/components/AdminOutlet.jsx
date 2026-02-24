import { Outlet } from "react-router-dom";

function AdminOutlet() {
	return (
		<div>
			<h2>Admin Header</h2>
			<Outlet />
		</div>
	);
}

export default AdminOutlet;