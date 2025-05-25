// src/pages/UserHome.jsx
import { Card, CardContent, Typography, Grid, CardActionArea } from "@mui/material";
import { IoMdRestaurant } from "react-icons/io";
import { FaOpencart } from "react-icons/fa";
import { LuHistory } from "react-icons/lu";
import { MdAccountCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function UserHome() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Ver Cardápio",
      description: "Explore os pratos disponíveis no nosso cardápio.",
      icon: <IoMdRestaurant fontSize="large" />,
      path: "/user/plates",
    },
    {
      title: "Meus Carrinho",
      description: "Acompanhe seus pedidos e o status da entrega.",
      icon: <FaOpencart fontSize="large" />,
      path: "/user/carts",
    },
    {
      title: "Histórico",
      description: "Veja todos os seus pedidos anteriores.",
      icon: <LuHistory fontSize="large" />,
      path: "/user/meus-pedidos",
    },
    {
      title: "Minha Conta",
      description: "Gerencie suas informações pessoais.",
      icon: <MdAccountCircle fontSize="large" />,
      path: "/profile",
    },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Bem-vindo ao Sistema de Cardápio Online
      </Typography>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
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
