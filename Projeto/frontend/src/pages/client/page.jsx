import { Card, CardContent, Typography, Grid } from "@mui/material";
import { IoMdRestaurant } from "react-icons/io";
import { FaOpencart } from "react-icons/fa";
import { LuHistory } from "react-icons/lu";
import { MdAccountCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import styles from "./UserHome.module.css";

export default function UserHome() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Ver Cardápio",
      description: "Explore nossa seleção de pratos deliciosos e faça seu pedido.",
      icon: <IoMdRestaurant className={styles.featureIcon} />,
      path: "/user/plates",
    },
    {
      title: "Meu Carrinho",
      description: "Confira os itens no seu carrinho e finalize sua compra.",
      icon: <FaOpencart className={styles.featureIcon} />,
      path: "/user/carts",
    },
    {
      title: "Histórico de Pedidos",
      description: "Acesse o histórico dos seus pedidos anteriores.",
      icon: <LuHistory className={styles.featureIcon} />,
      path: "/user/meus-pedidos",
    },
    {
      title: "Minha Conta",
      description: "Gerencie seu perfil e informações pessoais.",
      icon: <MdAccountCircle className={styles.featureIcon} />,
      path: "/profile",
    },
  ];

  return (
    <section className={styles.container}>
      <Typography
        variant="h4"
        component="h1"
        className={styles.title}
        aria-label="Bem-vindo ao Sistema de Cardápio Online"
      >
        Bem-vindo ao Nosso Cardápio Online
      </Typography>
      <br />
      <Grid container spacing={3} className={styles.grid}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              className={styles.card}
              onClick={() => navigate(feature.path)}
              role="button"
              aria-label={`Navegar para ${feature.title}`}
            >
              <CardContent className={styles.cardContent}>
                <div className={styles.iconWrapper}>{feature.icon}</div>
                <Typography variant="h6" component="h2" className={styles.cardTitle}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" className={styles.cardDescription}>
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </section>
  );
}
