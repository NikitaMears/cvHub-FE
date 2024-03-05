/*!
=========================================================
* Muse Ant Design Dashboard - v1.0.0
=========================================================
* Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tables from "./pages/Tables";
import Billing from "./pages/Billing";
import Rtl from "./pages/Rtl";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import CvList from "./components/cv/list";
import CvDetail from "./components/cv/detail";
import RFPList from "./components/rfp/list";
import RFPDetail from "./components/rfp/detail";
import TpList from "./components/tp/list";
import TpDetail from "./components/tp/detail";
import Project from "./components/project/project";

import User from "./components/userManagement/user";
import Permission from "./components/userManagement/permission";
import Role from "./components/userManagement/role";
import Login from "./components/userManagement/login";

import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/sign-up" exact component={SignUp} />
        <Route path="/sign-in" exact component={SignIn} />
        <Route path="/login" exact component={Login} />

        <Main>
          <Route exact path="/dashboard" component={Home} />
          <Route exact path="/tables" component={Tables} />
          <Route exact path="/billing" component={Billing} />
          <Route exact path="/rtl" component={Rtl} />
          <Route exact path="/profile" component={Profile} />

          <Route exact path="/cv" component={CvList} />
          <Route exact path="/cvDetails/:id" component={CvDetail} />
          <Route exact path="/rfp" component={RFPList} />
          <Route exact path="/project" component={Project} />

          <Route exact path="/rfpDetails/:id" component={RFPDetail} />
          <Route exact path="/tp" component={TpList} />
          <Route exact path="/tpDetails/:id" component={TpDetail} />
          <Route exact path="/users" component={User} />

          <Route exact path="/roles" component={Role} />
          <Route exact path="/permissions" component={Permission} />



          {/* <Redirect from="*" to="/dashboard" /> */}
        </Main>
      </Switch>
    </div>
  );
}

export default App;
