// src/pages/AdminHome.jsx
import { Card, CardContent, Typography, Grid, CardActionArea } from "@mui/material";
import { IoMdRestaurant, IoIosAddCircle, IoIosList, IoIosPeople } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function AdminHome() {
  const navigate = useNavigate();

  const adminFeatures = [
    {
      title: "Gerenciar Cardápio",
      description: "Adicione, edite ou remova pratos do cardápio.",
      icon: <IoMdRestaurant fontSize="large" />,
      path: "/admin/pratos",
    },
    {
      title: "Adicionar Prato",
      description: "Cadastre novos pratos no sistema.",
      icon: <IoIosAddCircle fontSize="large" />,
      path: "/admin/pratos/add",
    },
    {
      title: "Ver Pedidos",
      description: "Visualize e gerencie pedidos recebidos.",
      icon: <IoIosList fontSize="large" />,
      path: "/admin/pedidos",
    },
    {
      title: "Gerenciar Usuários",
      description: "Veja e administre os usuários cadastrados.",
      icon: <IoIosPeople fontSize="large" />,
      path: "/admin/users",
    },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Painel Administrativo
      </Typography>

      <Grid container spacing={4}>
        {adminFeatures.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardActionArea onClick={() => navigate(feature.path)}>
                <CardContent style={{ textAlign: "center" }}>
                  <div style={{ marginBottom: "1rem" }}>{feature.icon}</div>
                  <Typography variant="h6">{feature.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
