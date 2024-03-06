import Head from 'next/head';
import Link from 'next/link';
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";


function IndexPage() {
  const datasets = [{ "key": "one", "value": "random" }, { "key": "two", "value": "random" }, { "key": "three", "value": "random" }, { "key": "four", "value": "random" },]
  return (
    <div>
      <div className="w-full h-screen flex flex-row justify-center items-center text-center">
        <div className="flex flex-col text-xl m-20 space-y-12">
          <div className="border-4 border-black p-10 text-justify">Welcome Spiel - Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus, et sint nulla beatae non eveniet accusantium ratione velit corrupti labore odio quam voluptatum recusandae culpa quae nesciunt corporis. Architecto, asperiores? Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae quaerat illum eveniet deleniti fugiat! Adipisci, voluptate praesentium ut id dolor ipsam ullam expedita in mollitia eligendi enim ducimus, porro cupiditate.</div>
          <div className="my-10">Feel free to explore the datasets we used</div>

          <div className="flex justify-evenly text-center">
            {datasets.map((set => (
              <Card isFooterBlurred radius="lg" className="border">
                <CardBody className="m-4">Random Dataset - {set.key}</CardBody>
                <Divider />
                <CardBody><Link href="" className="hover:underline">link to dataset</Link></CardBody>
              </Card>
            )))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default IndexPage
