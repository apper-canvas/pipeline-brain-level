import React, { useState } from "react";
const [formData, setFormData] = useState({
    Name: '',
    Tags: '',
    order_date_c: new Date().toISOString().split('T')[0],
    customer_id_c: '',
    total_amount_c: '',
    status_c: 'Draft',
    shipping_address_c: '',
    billing_address_c: '',
    notes_c: ''
  });