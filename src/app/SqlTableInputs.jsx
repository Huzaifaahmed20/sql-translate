'use client';

import React, { useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';

export default function SqlTableInputs() {
  const [tableInputs, setTableInputs] = useState([{ query: '' }]);
  const [desireQuery, setDesireQuery] = useState('');
  const [result, setResult] = useState('');
  const [busy, setBusy] = useState(false);

  const addRow = () => {
    setTableInputs([...tableInputs, { query: '' }]);
  };

  const deleteRow = (idx) => {
    const _tableInputs = [...tableInputs];
    if (idx > -1) {
      _tableInputs.splice(idx, 1);
    }
    setTableInputs(_tableInputs);
  };

  const onTableInputChange = (e, idx) => {
    const _tableInputs = [...tableInputs];
    _tableInputs[idx] = { query: e.target.value };
    setTableInputs(_tableInputs);
  };

  const handleSubmit = async () => {
    const _desireQuery = `### query ${desireQuery}`;
    const _tableInputs = tableInputs.map((i) => {
      return `### ${i.query}\n`;
    });
    setBusy(true);
    const res = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tableInputs: _tableInputs,
        desiredQuery: _desireQuery,
      }),
    });
    const data = await res.json();

    setResult(data.result);
    setBusy(false);
  };

  return (
    <div className="d-flex flex-column w-75 mx-auto justify-content-center vh-100">
      <Row className="mb-3 justify-content-between">
        <Col>
          {React.Children.toArray(
            tableInputs.map((item, idx) => {
              return (
                <InputGroup className="mb-3">
                  {idx > 0 && (
                    <Button onClick={() => deleteRow(idx)} variant="danger">
                      X
                    </Button>
                  )}
                  <InputGroup.Text>Table 0{idx + 1}</InputGroup.Text>
                  <Form.Control
                    value={item.query}
                    onChange={(e) => onTableInputChange(e, idx)}
                    placeholder="Employee(id, name, department_id)"
                  />
                </InputGroup>
              );
            })
          )}
          <Button variant="secondary" onClick={addRow} className="ms-auto">
            Add Table Input
          </Button>
        </Col>
        <Col>
          <Form.Label>Enter your desired query</Form.Label>
          <Form.Control
            onChange={(e) => setDesireQuery(e.target.value)}
            value={desireQuery}
            as="textarea"
          />
        </Col>
      </Row>
      <Button
        className="mb-5 w-25 ms-auto"
        disabled={busy}
        onClick={handleSubmit}
      >
        {busy && <Spinner size="sm" />}{' '}
        {busy ? 'Generating output ...' : 'Submit'}
      </Button>
      {result && <div className="code-view">{result}</div>}
    </div>
  );
}
