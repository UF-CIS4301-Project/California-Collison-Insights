import Link from 'next/link';

function QueriesPage() {
  const queries = [{'key': "at-fault", 'value':'At-fault Party Demographics and Fatality Rates'},
    {'key': 'causes', 'value':'Possible Causes of Accidents compared to Budgets'}, {'key': 'geographic', 'value':'Geographic Analysis - What areas are more prone to accients over time?'}, {'key': 'vehicleType', 'value': 'Effect of Vehicle Type and Age of Fatality Rates'}, {'key':'road', 'value':'Effect of Road Conditions and Population Density of Traffic Collision Severity'}, {'key':'custom', 'value':'Create Custom Query'}]
  return (
    <div className="">

      <div className='flex flex-row min-h-screen justify-center mt-40'>

        <ul className='text-xl flex-col space-y-12 p-6'>
          <span className="text-3xl">Queries</span>
          {queries.map((queryName) => (
            <li className="border-4 text-xl text-center bg-transparent hover:bg-black text-black font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent rounded" key={queryName.key}>
              <Link href={`/queries/${queryName.key}`} key="">{queryName.value}</Link></li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default QueriesPage
