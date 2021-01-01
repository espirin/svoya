$(document).ready(function () {
    $("#grid").shieldGrid({
        dataSource: {
            data: gridData,
            schema: {
                fields: {
                    id: {path: "id", type: Number},
                    age: {path: "age", type: Number},
                    name: {path: "name", type: String},
                    company: {path: "company", type: String},
                    month: {path: "month", type: Date},
                    isActive: {path: "isActive", type: Boolean},
                    email: {path: "email", type: String},
                    transport: {path: "transport", type: String}
                }
            }
        },
        sorting: {
            multiple: true
        },
        rowHover: false,
        columns: [
            {field: "name", title: "Person Name", width: "120px"},
            {field: "age", title: "Age", width: "80px"},
            {field: "company", title: "Company Name"},
            {field: "month", title: "Date of Birth", format: "{0:MM/dd/yyyy}", width: "120px"},
            {field: "isActive", title: "Active"},
            {field: "email", title: "Email Address", width: "250px"},
            {field: "transport", title: "Custom Editor", width: "120px"},
            {
                width: 150,
                title: "Update/Delete Column",
                buttons: [
                    {commandName: "edit", caption: "Edit"},
                    {commandName: "delete", caption: "Delete"}
                ]
            }
        ],
        editing: {
            enabled: true,
            mode: "popup",
            confirmation: {
                "delete": {
                    enabled: true,
                    template: function (item) {
                        return "Delete row with ID = " + item.id
                    }
                }
            }
        }
    });
});
