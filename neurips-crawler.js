

async function get_data(page, type = 'NeurIPS%202023%20spotlight') {
	// NeurIPS%202023%20poster
	// NeurIPS%202023%20oral
	// NeurIPS%202023%20spotlight
	const limit = 25
	const base_url = `https://api2.openreview.net/notes?content.venue=${type}&details=replyCount%2Cpresentation&domain=NeurIPS.cc%2F2023%2FConference&limit=${limit}&offset=${(page - 1) * limit}`
	const res = await fetch(base_url, {
		method: 'get',
        params: null,
        body: null,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        credentials: "include",
        responseType: 'JSON',
        cache: 'no-cache'
	})
	const data = await res.json()
	console.log('data ', data)
	return data.notes
}

async function get_paper_list (total_papers, accept_type) {
  let data_list = []
  // const total_papers = 67 // 2773
  const limit = 25
  const promise_sequence = (Array.from(new Array(Math.ceil( total_papers / limit) + 1), () => 1)).reduce(async (acc, cur, index) => {
	const pre_res = await acc || []
	console.log('pre_res ', pre_res)
	data_list = [...data_list, ...pre_res]
	// const last_tweet = (pre_res.slice(-1) || [])[0] || {}

	if (index !== Math.ceil( total_papers / limit) ) {
	  const new_request = await get_data(index + 1, accept_type)
	  // console.log(cur, new_request, '\r\n\r\n\r\n')
	  return new_request
	} else {
	  return  Promise.resolve()
	}
  }, Promise.resolve([]))
  await promise_sequence
  console.log('find ', data_list)
  return data_list
}



(async function () {
	const papers = await get_paper_list(67, 'NeurIPS%202023%20oral')
	const csvContent = papers.reduce((acc, cur) => {
		return acc + '\n' + `${cur.id},${cur.content.title.value},https://openreview.net/forum?id=${cur.id},"${cur.content.keywords.value.join(',')}","${cur.content.abstract.value.replace(/\s/g, ' ')}"`
	}, 'paper_id,title,link,keywords,abstract')
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' })
	const objUrl = URL.createObjectURL(blob)
	const link = document.createElement('a')
	link.setAttribute('href', objUrl)
	link.setAttribute('download', 'oral.csv')
	link.textContent = 'Click to Download'

	document.querySelector('body').append(link)
	link.click()
})()


(async function () {
	const papers = await get_paper_list(378, 'NeurIPS%202023%20spotlight')
	const csvContent = papers.reduce((acc, cur) => {
		return acc + '\n' + `${cur.id},${cur.content.title.value},https://openreview.net/forum?id=${cur.id},"${cur.content.keywords.value.join(',')}","${cur.content.abstract.value.replace(/\s/g, ' ')}"`
	}, 'paper_id,title,link,keywords,abstract')
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' })
	const objUrl = URL.createObjectURL(blob)
	const link = document.createElement('a')
	link.setAttribute('href', objUrl)
	link.setAttribute('download', 'spotlight.csv')
	link.textContent = 'Click to Download'

	document.querySelector('body').append(link)
	link.click()
})()


(async function () {
	const papers = await get_paper_list(2773, 'NeurIPS%202023%20poster')
	const csvContent = papers.reduce((acc, cur) => {
		return acc + '\n' + `${cur.id},${cur.content.title.value},https://openreview.net/forum?id=${cur.id},"${cur.content.keywords.value.join(',')}","${cur.content.abstract.value.replace(/\s/g, ' ')}"`
	}, 'paper_id,title,link,keywords,abstract')
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' })
	const objUrl = URL.createObjectURL(blob)
	const link = document.createElement('a')
	link.setAttribute('href', objUrl)
	link.setAttribute('download', 'poster.csv')
	link.textContent = 'Click to Download'

	document.querySelector('body').append(link)
	link.click()
})()
