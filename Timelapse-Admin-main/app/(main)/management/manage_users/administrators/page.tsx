"use client";
import { UserService } from "@/demo/service/UserService";
import {
  Column,
} from "primereact/column";
import { Button } from "primereact/button";
import {
  DataTable,
} from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useEffect, useState, useRef } from "react";
import Moment from "react-moment";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Paginator } from "primereact/paginator";

const Administrators = () => {

  const [users, setUsers ] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [visibleDeleteUserDialog, setVisibleDeleteUserDialog] = useState(false);
  const toast = useRef<Toast>(null);
  const [params, setParams] = useState({
    page: 1, // Current Page
    first: 0,
    rows: 10,
    filter: '',
    role: 1,
    is_deleted: false,
    totalCount: 0
  })
  const [user, setUser] = useState<any>(null);
  const [visibleEditUserDialog, setVisibleEditUserDialog] = useState(false);
  const [eventGet, setEventGet] = useState(true);
  
  const availableStateList = [
    { name: 'Enabled', code: 0 },
    { name: 'Disabled', code: 1 }
  ];

  useEffect(() => {
    getUserList();
  }, [eventGet]);

  const getUserList = () => {
    setLoading(true);
    UserService.getUserList(params).then(res => {
      setUsers(res.data.users);
      setParams({...params, totalCount: res.data.totalCount});
      setLoading(false);
    });
  }

  const header1 = () => {
    return (
      <div className="flex justify-content-between">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            placeholder="Search"
            onChange={(e) => setParams({ ...params, filter: e.target.value })}
            onKeyPress={onFilterChange}
          />
        </span>
        {/* <Button
          type="button"
          icon="pi pi-user-plus"
          label="Add New"
          className="w-full sm:w-auto flex-order-0 sm:flex-order-1"
          outlined
        /> */}
      </div>
    );
  };

  const indexBody = (data: any, row: any) => {
    const { rowIndex } = row;
    return <>{ params.first +  rowIndex + 1}</>
  }

  const nameBody = (data: any) => {
    const { first_name, last_name } = data;
    return <>{first_name} {last_name}</>
  }

  const countryBody = (data: any) => {
    const { country } = data;
    return <>
      {
        country ? <img
            alt="flag"
            src={`/demo/images/flag/flag_placeholder.png`}
            className={`flag flag-${country.toLowerCase()}`}
            width={30}
          /> : <></>
      }
      <span style={{ marginLeft: ".5em", verticalAlign: "middle" }}>
        {country}
      </span>
    </>
  }

  const stateBody = (data: any) => {
    const { state } = data;
    const state_class = (state === 0 ? 'qualified' : 'unqualified');
    const state_name = (state === 0 ? 'Enable' : 'Disable')
    return <span className={`customer-badge status-${state_class}`}>
      {state_name}
    </span>
  }

  const lastLoginTimeBody = (data: any) => {
    const { last_login_time } = data;
    return <Moment format="YYYY-MM-DD">{last_login_time}</Moment>;
  }
  
  const actionBody = (data: any) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="mr-2"
          rounded
          severity="success"
          onClick={() => editUser(data)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          severity="danger"
          onClick={() => confirmDeleteUser(data)}
        />
      </>
    );
  };
  
  const editUser = (data: any) => {
    setUser(data);
    setVisibleEditUserDialog(true);
  }

  const confirmDeleteUser = (data: any) => {
    setUser(data);
    setVisibleDeleteUserDialog(true);
  }

  const onPageChange = async (pageData: any) => {
    const { first, page, rows } = pageData;
    setParams({ ...params, first, page, rows });
    setEventGet(!eventGet);
  }

  const onFilterChange = (e: any) => {
    if(e.which === 13) {
      setEventGet(!eventGet);
    }
  }

  const deleteUser = () => {
    setLoading(true);
    UserService.deleteUser(user._id).then(res => {
      setVisibleDeleteUserDialog(false);
      toast.current?.show({
        severity: "success",
        summary: "Deleted!",
        detail: `${user.first_name} ${user.last_name} was removed.`,
        life: 3000,
      });
      setEventGet(!eventGet);
    }).catch(err => {
      setLoading(false);
      toast.current?.show({
        severity: "error",
        summary: "Failed!",
        detail: `${user.first_name} ${user.last_name}'s deletion failed`,
        life: 3000,
      });
    })
  }

  const saveUser = () => {
    setLoading(true)
    UserService.saveUser(user).then(res => {
      if(res.data.code === 500) {
        toast.current?.show({
          severity: "warn",
          summary: "Updated",
          detail: res.data.message,
          life: 3000,
        });
        setLoading(false);
        return;
      }
      setLoading(false);
      setVisibleEditUserDialog(false);
      toast.current?.show({
        severity: "success",
        summary: "Updated!",
        detail: `${user.first_name} ${user.last_name} was updated.`,
        life: 3000,
      });
      setEventGet(!eventGet);
    }).catch(err => {
      setLoading(false);
      toast.current?.show({
        severity: "error",
        summary: "Failed!",
        detail: `${user.first_name} ${user.last_name}'s update failed`,
        life: 3000,
      });
    })
  }

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <h5>Manage Users</h5>
          <DataTable
            value={users}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            dataKey="_id"
            filterDisplay="menu"
            loading={loading}
            emptyMessage="No customers found."
            header={header1}
            size="small"
          >
            <Column
              header="No"
              body={indexBody}
              style={{ maxWidth: "2rem" }}
            />
            <Column
              header="Name"
              body={nameBody}
              style={{ minWidth: "12rem" }}
            />
            <Column
              header="E-mail"
              field="email"
            />
            <Column
              header="Country"
              body={countryBody}
            />
            <Column
              header="Status"
              body={stateBody}
            />
            <Column
              header="Last Login Time"
              body={lastLoginTimeBody}
            />
            <Column
              header="Action"
              body={actionBody}
            />
          </DataTable>
          <Paginator template={{
            layout: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport",
            CurrentPageReport: (options) => {
              return (
                  <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
                      {options.first} - {options.last} of {options.totalRecords}
                  </span>
              );
            }
          }} first={params.first} rows={params.rows} totalRecords={params.totalCount} rowsPerPageOptions={[10, 25, 50]} onPageChange={onPageChange} />
        </div>
      </div>
      {/* Delete Modal */}
      <Dialog
        visible={visibleDeleteUserDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={    <>
          <Button
            label="No"
            icon="pi pi-times"
            text
            onClick={() => setVisibleDeleteUserDialog(false)}
          />
          <Button label="Yes" icon="pi pi-check" loading={dialogLoading} text onClick={deleteUser} />
        </>}
        onHide={() => setVisibleDeleteUserDialog(false)}
      >
        <div className="flex align-items-center justify-content-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {user && (
            <span>
              Are you sure you want to delete <b>{user.first_name} {user.last_name}</b>?
            </span>
          )}
        </div>
      </Dialog>

      {/* Edit Modal */}
      <Dialog
        visible={visibleEditUserDialog}
        style={{ width: "450px" }}
        header="Edit User"
        modal
        className="p-fluid"
        footer={<>
          <Button label="Cancel" icon="pi pi-times" text onClick={() => setVisibleEditUserDialog(false)} />
          <Button label="Save" icon="pi pi-check" loading={dialogLoading} text onClick={saveUser} />
        </>}
        onHide={() => setVisibleEditUserDialog(false)}
      >
        <div className="field">
          <label htmlFor="first_name">First Name</label>
          <InputText
            id="first_name"
            value={user?.first_name}
            onChange={(e) => setUser({...user, first_name: e.target.value})}
            required
            autoFocus
            className={classNames({
              "p-invalid": !user?.first_name,
            })}
          />
          {!user?.first_name && (
            <small className="p-invalid">First Name is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="last_name">Last Name</label>
          <InputText
            id="last_name"
            value={user?.last_name}
            onChange={(e) => setUser({...user, last_name: e.target.value})}
            required
            autoFocus
            className={classNames({
              "p-invalid": !user?.last_name,
            })}
          />
          {!user?.last_name && (
            <small className="p-invalid">Last Name is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="email">E-Mail</label>
          <InputText
            id="email"
            value={user?.email}
            onChange={(e) => setUser({...user, email: e.target.value})}
            required
            autoFocus
            className={classNames({
              "p-invalid": !user?.email,
            })}
          />
          {!user?.email && (
            <small className="p-invalid">E-Mail is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="state">State</label>
          <Dropdown
            id="state"
            value={availableStateList.filter((item) => { return item.code == user?.state })[0]}
            onChange={(e) => setUser({ ...user, state: e.value.code })}
            options={availableStateList}
            optionLabel="name"
            placeholder="Select One"
          ></Dropdown>
        </div>
      </Dialog>
      <Toast ref={toast} />
    </div>
  )
}

export default Administrators;