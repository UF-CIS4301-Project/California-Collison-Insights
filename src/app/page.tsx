import Head from 'next/head';
import WelcomeBar from '@/app/components/ui/welcome-bar';
import SideNav from './components/ui/sidenav';


function IndexPage() {

  return (
    <div>
      <SideNav></SideNav>
      <WelcomeBar></WelcomeBar>
    </div>
  )
}

export default IndexPage
