const express = require('express');
const uuid = require('uuid');
const btoa = require('btoa');
const cors = require('cors');
const app = express();

const PORT = 4201;
const mediaType = process.env.API_MEDIA_TYPE ? process.env.API_MEDIA_TYPE : 'application/terminfinder.api-v1+json';
let appointments = generateAppointments();

function generateAppointments(participantCount = 3) {
  let startDate = new Date();
  startDate.setMonth(startDate.getMonth() + 1);

  let endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);
  endDate.setDate(endDate.getDate() + 1);

  startDate = startDate.toISOString().split('T')[0];
  endDate = endDate.toISOString().split('T')[0];
  const startTime = '10:00:00.000+00:00';
  const endTime = '12:34:00.000+00:00';

  // every date & time variant
  const suggestedDates = [
    {
      suggestedDateId: uuid.v4(),
      startDate: startDate,
      startTime: null,
      endDate: null,
      endTime: null,
      description: null
    },
    {
      suggestedDateId: uuid.v4(),
      startDate: startDate,
      startTime: startTime,
      endDate: null,
      endTime: null,
      description: null
    },
    {
      suggestedDateId: uuid.v4(),
      startDate: startDate,
      startTime: startTime,
      endDate: endDate,
      endTime: endTime,
      description: null
    },
    {
      suggestedDateId: uuid.v4(),
      startDate: startDate,
      startTime: null,
      endDate: endDate,
      endTime: null,
      description: null
    },
    {
      suggestedDateId: uuid.v4(),
      startDate: startDate,
      startTime: startTime,
      endDate: endDate,
      endTime: null,
      description: null
    },
    {
      suggestedDateId: uuid.v4(),
      startDate: startDate,
      startTime: startTime,
      endDate: endDate,
      endTime: endTime,
      description: null
    }
  ];

  const suggestedDateIds = suggestedDates.reduce((acc, curr) => [...acc, curr.suggestedDateId], []);

  const votingStatus = {
    0: 'declined',
    1: 'questionable',
    2: 'accepted'
  };

  let participants = [];
  for (let idx = 0; idx < participantCount; idx++) {
    const participantId = uuid.v4();
    let votings = [];

    suggestedDateIds.forEach(suggestedDateId => {
      votings.push({
        suggestedDateId: suggestedDateId,
        votingId: uuid.v4(),
        participantId: participantId,
        status: votingStatus[Math.floor(Math.random() * 3)]
      });
    });

    participants.push({
      name: (idx + 1).toString(),
      participantId: participantId,
      votings: votings
    });
  }

  return [
    {
      appointmentId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      customerId: '11111111-1111-1111-1111-111111111111',
      adminId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      creatorName: 'Deep Thought',
      subject: 'Variationen Datum Uhrzeit',
      description: '',
      place: '',
      status: 'started',
      password: null,
      suggestedDates: suggestedDates,
      participants: participants
    }
  ];
}

app.use(cors());
app.use(express.json({type: mediaType}));
app.use(express.urlencoded({extended: false}));
app.use((req, res, next) => {
  if (req.headers["content-type"] !== mediaType) {
    res.status(406).send();
  } else {
    next();
  }
});

function isAppointmentValid(appointment) {
  return !!appointment.appointmentId ||
    !!appointment.customerId ||
    !!appointment.adminId ||
    !!appointment.creatorName ||
    !!appointment.subject ||
    !!appointment.description ||
    !!appointment.place ||
    !!appointment.status ||
    !!appointment.suggestedDates.length;
}

function filterAppointment(obj) {
  const filtered = appointments.filter(appointment =>
    (appointment.appointmentId === obj.appointmentId && appointment.customerId === obj.customerId) ||
    (appointment.adminId === obj.adminId && appointment.customerId === obj.customerId));
  return (filtered.length === 1) ? filtered[0] : null;
}

function copyObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function isAuthenticated(isAdmin, requestAuth, appointment) {
  if (isAdmin) {
    return requestAuth === 'Basic ' + btoa(`${appointment.adminId}:${appointment.password}`);
  } else {
    return requestAuth === 'Basic ' + btoa(`${appointment.customerId}:${appointment.password}`);
  }
}

app.get('/app', (req, res) => {
  res.contentType(mediaType).status(200).json({
    "versionNumber": '0.5.0',
    "buildDate": '2020-10-01'
  });
});

app.post('/appointment/:customerId', (req, res) => {
  const obj = {
    "appointmentId": uuid.v4(),
    "customerId": req.params.customerId,
    "adminId": uuid.v4(),
    "creatorName": req.body.creatorName,
    "subject": req.body.subject,
    "description": req.body.description,
    "place": req.body.place,
    "status": req.body.status,
    "password": req.body.password,
    "suggestedDates": req.body.suggestedDates,
    "participants": req.body.participants
  };

  if (!isAppointmentValid(obj)) {
    return res.contentType(mediaType).status(400).json({
      msg: 'POST Missing arguments for appointment!',
      appointment: obj
    });
  }
  obj.suggestedDates.forEach(suggestedDate => {
    suggestedDate.suggestedDateId = uuid.v4();
  });
  appointments.push(obj);

  const output = copyObject(filterAppointment(obj));
  if (output) {
    output.password = null;
    res.contentType(mediaType).status(201).json(output);
  }
});

app.put('/appointment/:customerId', (req, res) => {
  const obj = {
    "appointmentId": req.body.appointmentId,
    "customerId": req.params.customerId,
    "adminId": req.body.adminId,
    "creatorName": req.body.creatorName,
    "subject": req.body.subject,
    "description": req.body.description,
    "place": req.body.place,
    "status": req.body.status,
    "password": req.body.password,
    "suggestedDates": req.body.suggestedDates,
    "participants": req.body.participants
  };

  if (!isAppointmentValid(obj)) {
    return res.contentType(mediaType).status(400).json({
      msg: 'PUT Missing arguments for appointment!',
      appointment: obj
    });
  }

  appointments = appointments.filter(appointment =>
    appointment.appointmentId !== obj.appointmentId || appointment.customerId !== obj.customerId);
  appointments.push(obj);

  const output = copyObject(filterAppointment(obj));
  if (output) {
    output.password = null;
    res.contentType(mediaType).status(200).json(output);
  }
});

app.get('/appointment/:customerId/:appointmentId/protection', (req, res) => {
  const obj = {
    'appointmentId': req.params.appointmentId,
    'customerId': req.params.customerId
  };
  const filtered = filterAppointment(obj);

  if (filtered) {
    res.contentType(mediaType).json({
      'appointmentId': filtered.appointmentId,
      'protected': !!filtered.password
    });
  } else {
    res.contentType(mediaType).status(400).json({msg: `PROTECTION: No member with the id of ${req.params.customerId} & ${req.params.appointmentId}`});
  }
});

app.get('/appointment/:customerId/:appointmentId/passwordverification', (req, res) => {
  const obj = {
    'appointmentId': req.params.appointmentId,
    'customerId': req.params.customerId
  };
  const filtered = filterAppointment(obj);

  if (filtered) {
    res.contentType(mediaType).json({
      'appointmentId': filtered.appointmentId,
      'passwordvalidation': isAuthenticated(false, req.headers.authorization, filtered),
      'protected': !!filtered.password
    });
  } else {
    res.contentType(mediaType).status(400).json({msg: `PW VERIFY: No member with the id of ${req.params.customerId} & ${req.params.appointmentId}`});
  }
});

function shuffle(array) {
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

app.get('/appointment/:customerId/:appointmentId', (req, res) => {
  const obj = {
    'appointmentId': req.params.appointmentId,
    'customerId': req.params.customerId
  };
  const filtered = copyObject(filterAppointment(obj));
  filtered.participants = shuffle(filtered.participants);
  filtered.participants.forEach(participant => {
    participant.votings = shuffle(participant.votings);
    if (filtered.suggestedDates.length >= 2) {
      participant.votings.pop();
    }
  });

  if (filtered) {
    filtered.password = null;
    res.contentType(mediaType).json(filtered);
  } else {
    res.contentType(mediaType).status(400).json({msg: `APPOINTMENT: No member with the id of ${req.params.customerId} & ${req.params.appointmentId}`});
  }
});

app.get('/admin/:customerId/:adminId/protection', (req, res) => {
  const obj = {
    'adminId': req.params.adminId,
    'customerId': req.params.customerId
  };
  const filtered = filterAppointment(obj);

  if (filtered) {
    res.contentType(mediaType).json({
      'appointmentId': filtered.appointmentId,
      'protected': !!filtered.password
    });
  } else {
    res.contentType(mediaType).status(400).json({msg: `ADMIN PROTECTION: No member with the id of ${req.params.customerId} & ${req.params.appointmentId}`});
  }
});

app.get('/admin/:customerId/:adminId/passwordverification', (req, res) => {
  const obj = {
    'adminId': req.params.adminId,
    'customerId': req.params.customerId
  };
  const filtered = filterAppointment(obj);

  if (filtered) {
    res.contentType(mediaType).json({
      'appointmentId': filtered.appointmentId,
      'passwordvalidation': isAuthenticated(true, req.headers.authorization, filtered),
      'protected': !!filtered.password
    });
  } else {
    res.contentType(mediaType).status(400).json({msg: `ADMIN PW VERIFY: No member with the id of ${req.params.customerId} & ${req.params.appointmentId}`});
  }
});

app.get('/admin/:customerId/:adminId', (req, res) => {
  let obj = {
    'adminId': req.params.adminId,
    'customerId': req.params.customerId
  };
  obj = copyObject(filterAppointment(obj));

  if (obj) {
    obj.password = null;
    res.contentType(mediaType).json(obj);
  } else {
    res.contentType(mediaType).status(400).json({msg: `APPOINTMENT: No member with the id of ${req.params.customerId} & ${req.params.adminId}`});
  }
});

app.put('/admin/:customerId/:adminId/paused/status', (req, res) => {
  let obj = {
    'adminId': req.params.adminId,
    'customerId': req.params.customerId
  };
  obj = filterAppointment(obj);

  if (obj) {
    obj.status = 'paused';
    const filtered = copyObject(obj);
    filtered.password = null;
    res.contentType(mediaType).json(filtered);
  } else {
    res.contentType(mediaType).status(400).json({msg: `APPOINTMENT: No member with the id of ${req.params.customerId} & ${req.params.adminId}`});
  }
});

app.put('/admin/:customerId/:adminId/started/status', (req, res) => {
  let obj = {
    'adminId': req.params.adminId,
    'customerId': req.params.customerId
  };
  obj = filterAppointment(obj);

  if (obj) {
    obj.status = 'started';
    const filtered = copyObject(obj);
    filtered.password = null;
    res.contentType(mediaType).json(filtered);
  } else {
    res.contentType(mediaType).status(400).json({msg: `APPOINTMENT: No member with the id of ${req.params.customerId} & ${req.params.adminId}`});
  }
});

app.put('/votings/:customerId/:appointmentId', (req, res) => {
  let obj = {
    "appointmentId": req.params.appointmentId,
    "customerId": req.params.customerId,
  };
  obj = filterAppointment(obj);
  if (!obj) {
    return res.contentType(mediaType).status(400).json({
      msg: 'PUT Missing arguments for appointment!',
      appointment: obj
    });
  }

  let newParticipants = req.body;
  if (!newParticipants || newParticipants.length === 0) {
    return res.contentType(mediaType).status(400).json({
      msg: 'PUT Missing arguments for votings!',
      appointment: newParticipants
    });
  }

  newParticipants.forEach(participant => {
    if (participant.participantId === null) {
      participant.participantId = uuid.v4();
    }
    participant.votings.forEach(voting => {
      if (voting.votingId === null) {
        voting.votingId = uuid.v4();
      }
      if (!voting.participantId) {
        voting.participantId = participant.participantId;
      }
    });

    obj.participants = obj.participants.filter(participantObj =>
      (participantObj.participantId !== participant.participantId)
    );
    obj.participants.push(participant);
  });

  if (!obj.participants) {
    return res.contentType(mediaType).status(400).json({
      msg: 'PUT Missing arguments for appointment!',
      appointment: obj
    });
  }

  appointments = appointments.filter(appointment =>
    appointment.appointmentId !== obj.appointmentId || appointment.customerId !== obj.customerId);
  appointments.push(obj);

  const output = filterAppointment(obj);
  if (output) {
    res.contentType(mediaType).status(201).json(output.participants);
  }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
