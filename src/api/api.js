
function makeRequest({ url, method, headers, data }) {
  let options = {
    method: method,
    headers: {
      'Content-type': 'application/json',
      ...headers
    },
    body: data ?
      JSON.stringify({
        ...data
      }) : null
  }

  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then((res) => {
        if (res.status < 400) {
          resolve(res.json());
        } else {
          reject(res.error);
          return
        }
      })
      .catch((err) => {
        reject(err);
        return
      })
  })
}

// function Request({ url, method, headers, data }) {
//   let options = {
//     method: method,
//     headers: {
//       'Content-type': 'application/json',
//       ...headers
//     },
//     body: data ?
//       JSON.stringify({
//         ...data
//       }) : null
//   }

//   return new Promise((resolve, reject) => {
//     fetch(url, options)
//       .then((res,data) => {
//         if (res.status < 400) {
//           console.log('consoling res')
//           const j=res.json()
//           // console.log(j)
//           console.log(data)
//           console.log(j.content)
//           console.log('ending here')

          
//           resolve(res)
//           return res
//         } else {
//           reject(res.error);
//           return 
//         }
//       }
//       // .then(data => console.log(data));
//       )
//       .catch((err) => {
//         reject(err);
//         return
//       })
//   })
// }

export const login = (username, password) => makeRequest({
  url: '/token-auth/',
  method: 'POST',
  data: {
    username: username, 
    password: password
  }
}).then(res => {
  localStorage.setItem('token', res.token)
})

export const addevent = (eventname, eventdesc , faceslist) => makeRequest({
  url: 'authentication/save_event/',  
  method: 'POST',
  data: {
    eventname: eventname, 
    eventdesc: eventdesc,
    faceslist: faceslist
  },
  headers: {
    Authorization: `JWT ${localStorage.getItem('token')}`
  }
})

export const register = (username, password) => makeRequest({
  url: '/authentication/users/',
  method: 'POST', 
  data: {
    username: username,
    password: password
  }
}).then(res => {
  localStorage.setItem('token', res.token)
})

export const current_user = () => makeRequest({
  url: '/authentication/current_user/',
  method: 'GET',
  headers: {
    Authorization: `JWT ${localStorage.getItem('token')}`
  }
})

export const capture = () => makeRequest({
  url: '/authentication/capture_image/',
  method: 'GET',
  headers: {
    Authorization: `JWT ${localStorage.getItem('token')}`
  }
})

export const attendance = () => makeRequest({
  url: '/authentication/attendance_record/',
  method: 'GET',
  headers: {
    Authorization: `JWT ${localStorage.getItem('token')}`
  }
})

export const trainmodel = () => makeRequest({
  url: '/authentication/train_model/',
  method: 'GET',
  headers: {
    Authorization: `JWT ${localStorage.getItem('token')}`
  }
})

export const addnew = (name, age, rollno, phoneno) => makeRequest({
  url: '/authentication/add_new/',
  method: 'POST',
  headers: {
    Authorization: `JWT ${localStorage.getItem('token')}`
  },
  data: {
    name: name, 
    age: age,
    rollno: rollno,
    phoneno: phoneno
  },
})

export const getstudentdetails = (search) => makeRequest({
  url: '/authentication/search/',
  method: 'POST',
  headers: {
    Authorization: `JWT ${localStorage.getItem('token')}`
  },
  data: {
    search: search,
  },
})

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('searchvalue')
}